---
sidebar_position: 1
---



# Authentication and authorization

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To access protected data in the Open Data Hub APIs, you must authenticate using OAuth 2.0 through Keycloak and include a valid access token in your API requests. This guide explains how to obtain and use tokens, manage their lifecycle, and request access to closed datasets. All instructions are written for API users who need to consume data from the Content API or Time Series API.

## 1. Getting started with authentication

The Open Data Hub uses Keycloak as its identity provider for API access. Authentication is required to retrieve closed data or perform write operations. You will interact with the Keycloak server in the `noi` realm to obtain time-limited access tokens.

You must use one of the supported OAuth 2.0 flows depending on your use case:

- **Client Credentials flow**: for machine-to-machine (service) authentication.
- **Password flow**: for user-based authentication using username and password.
- **Refresh Token flow**: to renew an expired access token without re-entering credentials.

The Content API and Time Series API both rely on these tokens but may differ in how they handle invalid or missing tokens.

### 1.1. Authentication endpoints

Use the following token endpoint to request access tokens:

```
https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token
```

For production environments, use:

```
https://auth.opendatahub.com/auth/realms/noi/protocol/openid-connect/token
```

Always verify which environment (testing or production) your application targets.

:::warning
Production client credentials are not public. Contact Open Data Hub Support to obtain them. Development credentials are provided only for testing.
:::

## 2. Using OAuth 2.0 flows

### 2.1. Client Credentials flow (machine-to-machine)

Use this flow when your application runs as a background service or data collector that does not represent a user.

This flow returns an `access_token` but no `refresh_token`. After the token expires, you must request a new one.

#### Example: Obtain a token using client credentials

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST \
  https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials&client_id=odh-mobility-datacollector-development&client_secret=7bd46f8f-c296-416d-a13d-dc81e68d0830&scope=openid'
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
	data := "grant_type=client_credentials&client_id=odh-mobility-datacollector-development&client_secret=7bd46f8f-c296-416d-a13d-dc81e68d0830&scope=openid"
	resp, _ := http.Post("https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token",
		"application/x-www-form-urlencoded", bytes.NewBuffer([]byte(data)))
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
}
```

  </TabItem>
</Tabs>

You will receive a JSON response containing the `access_token`:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "expires_in": 300,
  "refresh_expires_in": 0,
  "token_type": "Bearer"
}
```

### 2.2. Password flow (user-based login)

Use this flow when you have a user account and want to authenticate directly with username and password.

This flow is less secure than others and should be used only when necessary.

#### Example: Get a token using username and password

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST \
  https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password&client_id=odh-generic-client&username=<your-username>&password=<your-password>&scope=openid'
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token"
data = {
    "grant_type": "password",
    "client_id": "odh-generic-client",
    "username": "<your-username>",
    "password": "<your-password>",
    "scope": "openid"
}

response = requests.post(url, data=data)
print(response.json())
```

  </TabItem>
</Tabs>

The response includes both an `access_token` and a `refresh_token`.

### 2.3. Refresh Token flow

Use this flow to obtain a new `access_token` after it has expired, without requiring the user to re-enter credentials.

#### Example: Refresh an expired access token

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST \
  https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=refresh_token&client_id=odh-generic-client&client_secret=<your-client-secret>&refresh_token=<your-refresh-token>&scope=openid'
```

  </TabItem>
</Tabs>

## 3. Sending the access token

Once you have obtained an access token, include it in the `Authorization` header of every API request as a Bearer token.

### 3.1. Format of the Authorization header

```
Authorization: Bearer <access_token>
```

#### Example: Call the Content API with a token

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi" \
  -H "Authorization: Bearer $TOKEN"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://tourism.api.opendatahub.com/v1/ODHActivityPoi', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

  </TabItem>
</Tabs>

## 4. Token lifetime and renewal

Tokens have limited validity. You must handle expiration and refresh tokens accordingly.

| Token Type | Lifetime | Notes |
| :--- | :--- | :--- |
| `access_token` | 300 seconds (5 minutes) | Must be refreshed after expiry. |
| `refresh_token` | Up to 7200 seconds (2 hours) | Depends on Keycloak session settings. |

:::warning
If your token expires, the Content API may return a `200 OK` response but omit closed data fields. The Time Series API may silently filter out restricted records. Always check token validity before making requests.
:::

The `refresh_token` lifetime is determined by the minimum of:
- SSO Session Max
- SSO Session Idle
- Client-specific session limits (if configured)

Re-authenticate when both tokens have expired.

## 5. Accessing closed datasets

Some datasets are closed and require specific roles for access. These roles are managed via Keycloak and enforced by the Time Series API and Content API using role-based access control (RBAC).

### 5.1. Understanding roles

- Roles prefixed with `BDP_` (e.g., `BDP_VIEW_CLOSED_DATA`) grant access to closed datasets.
- The `GUEST` role defines what data is publicly available.
- `ODH_ROLE` roles manage quotas or billing plans, not data access.

To access closed data, you must be assigned a `BDP_` role in Keycloak.

### 5.2. Requesting access

If you need access to a closed dataset:

1. Contact Open Data Hub Support and specify:
   - Your user account (email)
   - The dataset or origin you need access to (e.g., Laimburg sensor data)
2. The team will assign the appropriate `BDP_` role to your account in Keycloak.

You do not need to manage ACL rule files or modify configuration repositories — this is handled by administrators.

### 5.3. Verifying role assignment

After being granted a role, ensure your client application receives the correct scope:

- If `Full Scope Allowed` is enabled on the client, all roles are included automatically.
- If disabled, specific roles must be manually assigned under **Client Roles** in Keycloak.

Without proper scoping, your token will not include the required roles even if they are assigned to your user.

## 6. Tools and interfaces

You can manage authentication through various tools.

### 6.1. Swagger UI

In Swagger interfaces (e.g., for the Content API or Time Series API):

1. Click **Authorize**.
2. Enter your username, password, and `client_id` (e.g., `odh-generic-client`).
3. Click **Authorize** to apply the token to all operations.

Swagger stores the token in your browser session.

:::warning
To log out, click **Logout** in the Authorize dialog. Closing the tab may not invalidate the session.
:::

### 6.2. Postman

In Postman:

1. Go to the **Authorization** tab.
2. Select **OAuth 2.0**.
3. Choose **Password Credentials** grant type.
4. Enter:
   - Token Name
   - Auth URL (not used for password flow)
   - Access Token URL: `https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token`
   - Client ID: `odh-generic-client`
   - Username and Password
   - Scope: `openid`
5. Click **Get New Access Token**, then **Use Token**.

Ensure your environment variables or headers are set correctly to avoid sending unauthenticated requests.

## 7. Common issues and troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `401 Unauthorized` | Invalid, malformed, or expired token | Request a new token |
| No closed data returned | Token missing required `BDP_` role | Contact support to request role assignment |
| `context deadline exceeded` in logs | Inactive telemetry system | This can be safely ignored |
| Multiple accounts with same email | Duplicate identities in Keycloak | Agree to combine accounts and follow on-screen instructions |

:::info
The `odh-generic-client` can be used without a `client_secret` for development. Use any string as `client_id`, such as `My test request`.
:::

:::warning
Never hardcode production credentials in client applications. Use secure secret management practices.
:::
