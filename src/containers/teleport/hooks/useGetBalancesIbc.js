/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState, useContext } from 'react';
import { Sha256 } from '@cosmjs/crypto';
import { CYBER } from '../../../utils/config';
import coinDecimalsConfig from '../../../utils/configToken';
import { reduceBalances } from '../../../utils/utils';
import networkList from '../../../utils/networkListIbc';
import { AppContext } from '../../../context';

const initValueBalance = { amount: 0, denom: '' };

const sha256 = (data) => {
  return new Uint8Array(new Sha256().update(data).digest());
};

const ibcDenom = (paths, coinMinimalDenom) => {
  const prefixes = [];
  for (const path of paths) {
    prefixes.push(`${path.portId}/${path.channelId}`);
  }
  const prefix = prefixes.join('/');
  const denom = `${prefix}/${coinMinimalDenom}`;

  return `ibc/${Buffer.from(sha256(Buffer.from(denom)))
    .toString('hex')
    .toUpperCase()}`;
};

// const de = ibcDenom([{ portId: 'transfer', channelId: 'channel-2' }], 'uosmo');

function useGetBalancesIbc(client, denom) {
  const { ibcDataDenom } = useContext(AppContext);
  const [balanceIbc, setBalanceIbc] = useState(null);
  const [denomIbc, setDenomIbc] = useState(null);

  // useEffect(() => {
  //   const getBalance = async () => {
  //     setBalanceIbc(null);
  //     if (client !== null && denom !== null) {
  //       const responseChainId = client.signer.chainId;
  //       if (responseChainId !== CYBER.CHAIN_ID) {
  //         if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
  //           const { coinMinimalDenom } = coinDecimalsConfig[denom];
  //           const [{ address }] = await client.signer.getAccounts();

  //           const responseBalance = await client.queryClient.bank.balance(
  //             address,
  //             coinMinimalDenom
  //           );
  //           console.log('response', responseBalance);
  //           setBalanceIbc({ [denom]: responseBalance.amount });
  //         }
  //       }
  //     }
  //   };
  //   getBalance();
  // }, [client, denom]);

  useEffect(() => {
    const getBalance = async () => {
      if (client !== null && denom !== null) {
        const responseChainId = client.signer.chainId;
        if (responseChainId !== CYBER.CHAIN_ID) {
          let coinMinimalDenom = null;
          if (denom.includes('ibc')) {
            coinMinimalDenom = ibcDataDenom[denom].baseDenom;
          } else {
            coinMinimalDenom = ibcDenom(
              [
                {
                  portId: 'transfer',
                  channelId: networkList[responseChainId].sourceChannelId,
                },
              ],
              denom
            );
          }
          const [{ address }] = await client.signer.getAccounts();
          const responseBalance = await client.queryClient.bank.balance(
            address,
            coinMinimalDenom
          );
          setDenomIbc(coinMinimalDenom);
          console.log('response', responseBalance);
          setBalanceIbc({ [coinMinimalDenom]: responseBalance.amount });
        }
      }
    };
    getBalance();
  }, [client, denom, ibcDataDenom]);

  return { balanceIbc, denomIbc };
}

export default useGetBalancesIbc;
