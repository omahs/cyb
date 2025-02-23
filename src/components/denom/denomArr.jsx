import React, { useContext, useEffect, useState, useMemo } from 'react';
import Denom from './index';
import { AppContext } from '../../context';

function DenomArr({
  denomValue,
  onlyText,
  onlyImg,
  tooltipStatusImg,
  tooltipStatusText,
  type,
  ...props
}) {
  const { traseDenom } = useContext(AppContext);

  const useDenomValue = useMemo(() => {
    let denom = denomValue;
    let infoDenom = {};

    if (type === undefined) {
      infoDenom = traseDenom(denomValue);
      const { denom: denomTrase } = infoDenom;
      denom = denomTrase;
    }

    if (typeof denom === 'string') {
      return (
        <Denom
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={denom}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
          type={type}
          infoDenom={infoDenom}
          gap={13}
          {...props}
        />
      );
    }

    if (typeof denom === 'object') {
      return (
        <div style={{ display: 'flex' }}>
          {!onlyText && (
            <>
              <Denom
                type={type}
                denomValue={denom[0].denom}
                onlyImg
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={infoDenom.denom[0]}
                {...props}
              />
              <Denom
                type={type}
                denomValue={denom[1].denom}
                marginContainer={
                  onlyImg ? '0px 0px 0px -12px' : '0px 5px 0px -12px'
                }
                onlyImg
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={infoDenom.denom[1]}
                {...props}
              />
            </>
          )}

          {!onlyImg && (
            <>
              <Denom
                type={type}
                denomValue={denom[0].denom}
                onlyText
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={infoDenom.denom[0]}
                {...props}
              />
              -
              <Denom
                type={type}
                denomValue={denom[1].denom}
                onlyText
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={infoDenom.denom[1]}
                {...props}
              />
            </>
          )}
        </div>
      );
    }
    return null;
  }, [denomValue]);

  try {
    return useDenomValue;
    // return <ValueImg text={denom} type={type} {...props} />;
  } catch (error) {
    return <div>{denomValue}</div>;
  }
}

export default DenomArr;
