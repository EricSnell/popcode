import test from 'tape';
import partial from 'lodash-es/partial';
import tap from 'lodash-es/tap';
import {Map} from 'immutable';

import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userWithCredentials} from '../../helpers/factory';
import reducer from '../../../src/reducers/user';
import {
  accountMigrationNeeded,
  identityLinked,
  userAuthenticated,
  userLoggedOut,
} from '../../../src/actions/user';
import {LoginState} from '../../../src/enums';
import {AccountMigration, User, UserAccount} from '../../../src/records';

const userWithCredentialsIn = userWithCredentials();

const loggedOutState = new User({
  loginState: LoginState.ANONYMOUS,
});

const loggedInState = new User({
  loginState: LoginState.AUTHENTICATED,
  account: new UserAccount({
    id: userWithCredentialsIn.user.uid,
    displayName: userWithCredentialsIn.user.displayName,
    avatarUrl: userWithCredentialsIn.user.photoURL,
    accessTokens: new Map({
      'github.com': userWithCredentialsIn.credentials[0].accessToken,
    }),
  }),
});

test('userAuthenticated', reducerTest(
  reducer,
  states.initial,
  partial(
    userAuthenticated,
    userWithCredentialsIn.user,
    userWithCredentialsIn.credentials,
  ),
  loggedInState,
));

test('identityLinked', reducerTest(
  reducer,
  loggedInState,
  partial(
    identityLinked,
    {providerId: 'google.com', idToken: 'abc'},
  ),
  loggedInState.setIn(['account', 'accessTokens', 'google.com'], 'abc'),
));

tap({providerId: 'github.com'}, (credentialToMerge) => {
  test('accountMigrationNeeded', reducerTest(
    reducer,
    loggedInState,
    partial(
      accountMigrationNeeded,
      credentialToMerge,
    ),
    loggedInState.set(
      'currentMigration',
      new AccountMigration({credentialToMerge}),
    ),
  ));
});

test('userLoggedOut', reducerTest(
  reducer,
  loggedInState,
  userLoggedOut,
  loggedOutState,
));
