export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CreateUserGroupInput = {
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type DeleteUserGroupInput = {
  id: Scalars['Int'];
};

export type DeleteUserInput = {
  id: Scalars['Int'];
};

export type EditUserGroupInput = {
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type EditUserInput = {
  id: Scalars['Int'];
  email?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Scalars['String']>>;
  validated?: Maybe<Scalars['Boolean']>;
  locked?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  signUp: SignUpPayload;
  signIn: SignInPayload;
  signOut: Scalars['Boolean'];
  createUser: User;
  editUser: User;
  deleteUser: Scalars['Boolean'];
  createUserGroup: UserGroup;
  editUserGroup: UserGroup;
  deleteUserGroup: Scalars['Boolean'];
};


export type MutationSignUpArgs = {
  input?: Maybe<SignUpUserInput>;
};


export type MutationSignInArgs = {
  input?: Maybe<SignInInput>;
};


export type MutationCreateUserArgs = {
  input?: Maybe<CreateUserInput>;
};


export type MutationEditUserArgs = {
  input?: Maybe<EditUserInput>;
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>;
};


export type MutationCreateUserGroupArgs = {
  input?: Maybe<CreateUserGroupInput>;
};


export type MutationEditUserGroupArgs = {
  input?: Maybe<EditUserGroupInput>;
};


export type MutationDeleteUserGroupArgs = {
  input?: Maybe<DeleteUserGroupInput>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  users?: Maybe<UsersPayload>;
  user: User;
  userGroups?: Maybe<UserGroupsPayload>;
  userGroup: UserGroup;
};


export type QueryUsersArgs = {
  search?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryUserGroupsArgs = {
  search?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
};


export type QueryUserGroupArgs = {
  id: Scalars['Int'];
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignInPayload = {
  __typename?: 'SignInPayload';
  accessToken: Scalars['String'];
};

export type SignUpPayload = {
  __typename?: 'SignUpPayload';
  user: User;
  accessToken: Scalars['String'];
};

export type SignUpUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  validated: Scalars['Boolean'];
  locked: Scalars['Boolean'];
  groups: Array<UserGroup>;
  createdBy: Scalars['String'];
  createdDate: Scalars['DateTime'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['DateTime'];
};

export type UserGroup = {
  __typename?: 'UserGroup';
  id: Scalars['Int'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  users: Array<User>;
  createdBy: Scalars['String'];
  createdDate: Scalars['DateTime'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['DateTime'];
};

export type UserGroupsPayload = {
  __typename?: 'UserGroupsPayload';
  userGroups: Array<UserGroup>;
  total: Scalars['Int'];
};

export type UsersPayload = {
  __typename?: 'UsersPayload';
  users: Array<User>;
  total: Scalars['Int'];
};
