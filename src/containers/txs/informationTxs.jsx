import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
import { Link } from 'react-router-dom';
import { ContainerGradient } from '../portal/components';

const dateFormat = require('dateformat');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

const InformationTxs = ({ data, messageError, ...props }) => {
  console.log(data);
  const value = Object.keys(data).map((key) => {
    let item = '';
    switch (key) {
      case 'height':
        item = formatNumber(data[key]);
        break;
      case 'status':
        item = data[key] ? 'Success' : 'Fail';
        break;
      case 'timestamp':
        item = dateFormat(data[key], 'UTC: dd/mm/yyyy, hh:MM:ss tt "UTC"');
        break;
      default:
        item = data[key];
        break;
    }

    return (
      <Pane
        key={`${key}-container`}
        className="txs-contaiter-row"
        display="grid"
        gridTemplateColumns="240px 1fr"
      >
        <Text
          key={`${key}-title`}
          display="flex"
          fontSize="16px"
          textTransform="capitalize"
          color="#fff"
          whiteSpace="nowrap"
          width="240px"
          marginBottom="5px"
          lineHeight="20px"
        >
          {key} :
        </Text>
        <Text
          key={`${key}-value`}
          display="flex"
          color="#fff"
          fontSize="16px"
          alignItems="center"
          wordBreak="break-all"
          lineHeight="20px"
          marginBottom="5px"
        >
          {key === 'status' && (
            <img
              style={{ width: '20px', height: '20px', marginRight: '5px' }}
              src={data[key] ? statusTrueImg : statusFalseImg}
              alt="statusImg"
            />
          )}
          {key === 'height' ? (
            <Link to={`/network/bostrom/block/${data[key]}`}>{item}</Link>
          ) : (
            item
          )}
        </Text>
      </Pane>
    );
  });

  return (
    <ContainerGradient
      togglingDisable
      userStyleContent={{ height: 'auto' }}
      title={
        <Text color="#fff" fontSize="20px" fontWeight="500" lineHeight="1.5">
          Information
        </Text>
      }
      {...props}
      styleLampContent={!data.status ? 'red' : 'blue'}
      txs={
        !data.status
          ? { rawLog: messageError, status: !data.status ? 'error' : '' }
          : false
      }
    >
      {/* {!data.status && (
        <Pane
          paddingX={10}
          paddingY={10}
          marginBottom="20px"
          boxShadow="0 0 4px 0px #d32f2f"
          borderRadius="5px"
          backgroundColor="#d32f2f2b"
        >
          Warning! {messageError}
        </Pane>
      )} */}
      <Pane display="flex" width="100%" flexDirection="column">
        {value}
      </Pane>
    </ContainerGradient>
  );
};

export default InformationTxs;
