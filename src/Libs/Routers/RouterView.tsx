import { observer } from 'mobx-react-lite';

import { RouterView as MsrRouterView, ViewMap } from "mobx-state-router";
import * as React from 'react';

export const RouterView: React.FC<{viewMap:ViewMap}> = observer(({viewMap}) => {
    return (
        <MsrRouterView viewMap={viewMap} />
    )
});
