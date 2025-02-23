import React, { useEffect, useState, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { ActionBar, Button } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import {
  ContainerGradient,
  Signatures,
  ScrollableTabs,
  MainContainer,
  ActionBarSteps,
  BtnGrd,
  MoonAnimation,
  Stars,
} from './components';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { activePassport, parseRowLog } from './utils';
import PasportCitizenship from './pasport';
import GetCitizenship from './citizenship';
import Info from './citizenship/Info';
import { steps } from './citizenship/utils';
import { STEP_INFO } from './gift/utils';
import ActionBarPortalGift from './gift/ActionBarPortalGift';
import ActionBarAddAvatar from './ActionBarAddAvatar';

const portalAmbient = require('../../sounds/portalAmbient112.mp3');

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_READY = 2;

const STATE_AVATAR = 15;
const STATE_AVATAR_IN_PROCESS = 15.1;

const portalAmbientObg = new Audio(portalAmbient);
const playPortalAmbient = () => {
  portalAmbientObg.loop = true;
  portalAmbientObg.play();
};

const stopPortalAmbient = () => {
  portalAmbientObg.loop = false;
  portalAmbientObg.pause();
  portalAmbientObg.currentTime = 0;
};

function PasportMoonCitizenship({ defaultAccount, mobile }) {
  const history = useHistory();
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);
  const [citizenship, setCitizenship] = useState(null);
  const [appStep, setStepApp] = useState(STEP_INFO.STATE_INIT);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    playPortalAmbient();

    return () => {
      stopPortalAmbient();
    };
  }, []);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setUpdateFunc((item) => item + 1);
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            setStepApp(STEP_INFO.STATE_INIT);

            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: parseRowLog(response.rawLog.toString()),
            }));
            setStepApp(STEP_INFO.STATE_INIT);
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  useEffect(() => {
    const getPasport = async () => {
      if (jsCyber !== null) {
        setStagePortal(STAGE_LOADING);
        const addressActiveData = getActiveAddress(defaultAccount);
        if (addressActiveData !== null) {
          const response = await activePassport(
            jsCyber,
            addressActiveData.bech32
          );
          console.log('response', response);
          if (response !== null) {
            console.log('response', response);
            setCitizenship(response);
            setStagePortal(STAGE_READY);
          }
        }
      }
    };
    getPasport();
  }, [jsCyber, defaultAccount, updateFunc]);

  const getActiveAddress = (address) => {
    const { account } = address;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      addressPocket = {
        bech32,
        keys,
      };
    }
    return addressPocket;
  };

  const onClickProveeAddress = () => {
    setStepApp(STEP_INFO.STATE_PROVE_CONNECT);
  };

  const onClickDeleteAddress = () => {
    setStepApp(STEP_INFO.STATE_DELETE_ADDRESS);
  };

  const onClickEditAvatar = () => {
    setStepApp(STATE_AVATAR);
  };

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const nickname = citizenship !== null ? citizenship.extension.nickname : '';
  return (
    <>
      <MainContainer>
        <Stars />
        {!mobile && <MoonAnimation />}
        <Info stepCurrent={steps.STEP_CHECK_GIFT} nickname={nickname || ''} />
        <PasportCitizenship
          citizenship={citizenship}
          txHash={txHash}
          onClickProveeAddress={onClickProveeAddress}
          onClickDeleteAddress={onClickDeleteAddress}
          onClickEditAvatar={onClickEditAvatar}
          updateFunc={setSelectedAddress}
        />
      </MainContainer>
      {Math.floor(appStep) === STEP_INFO.STATE_INIT && (
        <ActionBarSteps>
          <BtnGrd text="check gift" onClick={() => history.push('/gift')} />
        </ActionBarSteps>
      )}
      {Math.floor(appStep) !== STEP_INFO.STATE_INIT &&
        Math.floor(appStep) < STATE_AVATAR && (
          <ActionBarPortalGift
            // updateFunc={() => setUpdateFunc((item) => item + 1)}
            addressActive={addressActive}
            citizenship={citizenship}
            updateTxHash={updateTxHash}
            selectedAddress={selectedAddress}
            activeStep={appStep}
            setStepApp={setStepApp}
          />
        )}

      {Math.floor(appStep) === STATE_AVATAR && (
        <ActionBarAddAvatar
          step={appStep}
          setStep={setStepApp}
          updateTxHash={updateTxHash}
          citizenship={citizenship}
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(PasportMoonCitizenship);
