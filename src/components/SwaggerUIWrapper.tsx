// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useEffect, useState } from 'react';

interface SwaggerUIWrapperProps {
  /** URL of the OpenAPI/Swagger spec to render. */
  url: string;
  /** How operations are expanded by default: 'list' | 'full' | 'none'. */
  docExpansion?: 'list' | 'full' | 'none';
  /** Enable the in-browser "Try it out" feature. */
  tryItOutEnabled?: boolean;
}

export default function SwaggerUIWrapper({
  url,
  docExpansion = 'none',
  tryItOutEnabled = true,
}: SwaggerUIWrapperProps) {
  const [SwaggerUI, setSwaggerUI] = useState<any>(null);

  useEffect(() => {
    import('swagger-ui-react').then((module) => {
      setSwaggerUI(() => module.default);
      import('swagger-ui-react/swagger-ui.css'); // Load CSS dynamically
      import('@site/src/css/swagger-dark-fix.css');
      import('@site/src/css/swagger-badge-fix.css');
    });
  }, []);

  if (!SwaggerUI) return <div>Loading Swagger UI...</div>;

  return (
    <SwaggerUI
      url={url}
      docExpansion={docExpansion}
      tryItOutEnabled={tryItOutEnabled}
    />
  );
}
