// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useEffect, useState } from 'react';

export default function SwaggerUIWrapper() {
  const [SwaggerUI, setSwaggerUI] = useState<any>(null);

  useEffect(() => {
    import('swagger-ui-react').then((module) => {
      setSwaggerUI(() => module.default);
      import('swagger-ui-react/swagger-ui.css'); // Load CSS dynamically
      import('@site/src/css/swagger-dark-fix.css');
    });
  }, []);

  if (!SwaggerUI) return <div>Loading Swagger UI...</div>;

  return (
    <SwaggerUI url="https://mobility.api.opendatahub.com/v2/apispec" tryItOutEnabled={true} />
  );
}
