import React from 'react';
import moment from 'moment';
import { PageContext } from 'antdsite';

export const ShowTime = () => {
  return (
    <PageContext.Consumer>
      {context => {
        return (
          <div className="modifiedTime modifiedTimeLeft">
            {context.currentLocaleWebConfig.themeConfig.lastUpdated}{' '}
            {moment(context.currentPageInfo.fields.modifiedTime).format(
              'YYYY-MM-DD HH:mm:SS'
            )}
          </div>
        );
      }}
    </PageContext.Consumer>
  );
};
