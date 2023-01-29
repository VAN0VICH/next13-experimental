import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  File: any;
};

export type Comment = {
  __typename?: 'Comment';
  PK?: Maybe<Scalars['String']>;
  SK?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  creatorId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type LastEvaluatedKey = {
  creatorId: Scalars['String'];
  id: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createQuest?: Maybe<Scalars['Boolean']>;
  createUser?: Maybe<Scalars['Boolean']>;
  publishQuest?: Maybe<Scalars['Boolean']>;
  test?: Maybe<Scalars['String']>;
  updateQuestAttributes?: Maybe<Scalars['Boolean']>;
  updateQuestDescription?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateQuestArgs = {
  creatorId: Scalars['String'];
  id: Scalars['String'];
};


export type MutationCreateUserArgs = {
  userId: Scalars['String'];
};


export type MutationPublishQuestArgs = {
  id: Scalars['String'];
};


export type MutationUpdateQuestAttributesArgs = {
  updateQuestTransactions?: InputMaybe<Array<InputMaybe<UpdateQuestTransaction>>>;
};


export type MutationUpdateQuestDescriptionArgs = {
  description: Scalars['String'];
  questId: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Quest>;
  hasNextPage: Scalars['Boolean'];
};

export type PublishedQuests = {
  __typename?: 'PublishedQuests';
  nodes?: Maybe<Array<Maybe<Quest>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  publishedQuest?: Maybe<Quest>;
  publishedQuests?: Maybe<PublishedQuests>;
  userById?: Maybe<User>;
  userByUsername?: Maybe<User>;
  workspaceQuest?: Maybe<Quest>;
  workspaceQuestAndSolutionList?: Maybe<Array<Maybe<Quest>>>;
  workspaceQuestAndSolutionListVersion?: Maybe<Scalars['Int']>;
};


export type QueryMeArgs = {
  id: Scalars['String'];
};


export type QueryPublishedQuestArgs = {
  id: Scalars['String'];
};


export type QueryPublishedQuestsArgs = {
  after?: InputMaybe<LastEvaluatedKey>;
};


export type QueryUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String'];
};


export type QueryWorkspaceQuestArgs = {
  questId: Scalars['String'];
  userId: Scalars['String'];
};


export type QueryWorkspaceQuestAndSolutionListArgs = {
  userId: Scalars['String'];
};


export type QueryWorkspaceQuestAndSolutionListVersionArgs = {
  userId: Scalars['String'];
};

export type Quest = {
  __typename?: 'Quest';
  PK?: Maybe<Scalars['String']>;
  SK?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  creatorId?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  inTrash: Scalars['Boolean'];
  published?: Maybe<Scalars['Boolean']>;
  publishedAt?: Maybe<Scalars['Date']>;
  reward?: Maybe<Scalars['Int']>;
  slots?: Maybe<Scalars['Int']>;
  subtopic?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  topic?: Maybe<Scalars['String']>;
  version: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  questPublished?: Maybe<Quest>;
};


export type SubscriptionQuestPublishedArgs = {
  publisherId: Scalars['String'];
};

export type UpdateQuestTransaction = {
  attribute: Scalars['String'];
  number?: InputMaybe<Scalars['Int']>;
  questId: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  PK?: Maybe<Scalars['String']>;
  SK?: Maybe<Scalars['String']>;
  about?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['Date']>;
  email?: Maybe<Scalars['String']>;
  experience?: Maybe<Scalars['Int']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  level?: Maybe<Scalars['Int']>;
  role?: Maybe<Scalars['String']>;
  subtopics?: Maybe<Array<Maybe<Scalars['String']>>>;
  topics?: Maybe<Array<Maybe<Scalars['String']>>>;
  username?: Maybe<Scalars['String']>;
};

export type QuestFragment = { __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, subtopic?: string | null, reward?: number | null, slots?: number | null, description?: string | null, createdAt?: any | null };

export type UserFragment = { __typename?: 'User', id: string, username?: string | null, level?: number | null, experience?: number | null };

export type CreateQuestMutationVariables = Exact<{
  id: Scalars['String'];
  creatorId: Scalars['String'];
}>;


export type CreateQuestMutation = { __typename?: 'Mutation', createQuest?: boolean | null };

export type CreateUserMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: boolean | null };

export type PublishQuestMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type PublishQuestMutation = { __typename?: 'Mutation', publishQuest?: boolean | null };

export type UpdateQuestAttributesMutationVariables = Exact<{
  updateQuestTransactions: Array<InputMaybe<UpdateQuestTransaction>> | InputMaybe<UpdateQuestTransaction>;
}>;


export type UpdateQuestAttributesMutation = { __typename?: 'Mutation', updateQuestAttributes?: boolean | null };

export type UpdateQuestDescriptionMutationVariables = Exact<{
  questId: Scalars['String'];
  description: Scalars['String'];
}>;


export type UpdateQuestDescriptionMutation = { __typename?: 'Mutation', updateQuestDescription?: boolean | null };

export type PublishedQuestQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PublishedQuestQuery = { __typename?: 'Query', publishedQuest?: { __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, subtopic?: string | null, reward?: number | null, slots?: number | null, description?: string | null, createdAt?: any | null } | null };

export type PublishedQuestsQueryVariables = Exact<{
  after?: InputMaybe<LastEvaluatedKey>;
}>;


export type PublishedQuestsQuery = { __typename?: 'Query', publishedQuests?: { __typename?: 'PublishedQuests', nodes?: Array<{ __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, subtopic?: string | null, reward?: number | null, slots?: number | null, description?: string | null, createdAt?: any | null } | null> | null, pageInfo?: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: { __typename?: 'Quest', id: string, title?: string | null, creatorId?: string | null } | null } | null } | null };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', id: string, username?: string | null, level?: number | null, experience?: number | null } | null };

export type WorkspaceQuestAndSolutionListVersionQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type WorkspaceQuestAndSolutionListVersionQuery = { __typename?: 'Query', workspaceQuestAndSolutionListVersion?: number | null };

export type WorkspaceQuestQueryVariables = Exact<{
  questId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type WorkspaceQuestQuery = { __typename?: 'Query', workspaceQuest?: { __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, subtopic?: string | null, reward?: number | null, slots?: number | null, description?: string | null, createdAt?: any | null } | null };

export type WorkspaceQuestAndSolutionListQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type WorkspaceQuestAndSolutionListQuery = { __typename?: 'Query', workspaceQuestAndSolutionList?: Array<{ __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, inTrash: boolean, version: number } | null> | null };

export type QuestCreatedSubscriptionVariables = Exact<{
  publisherId: Scalars['String'];
}>;


export type QuestCreatedSubscription = { __typename?: 'Subscription', questPublished?: { __typename?: 'Quest', id: string, title?: string | null, topic?: string | null, subtopic?: string | null, reward?: number | null, slots?: number | null, description?: string | null, createdAt?: any | null } | null };

export const QuestFragmentDoc = gql`
    fragment Quest on Quest {
  id
  title
  topic
  subtopic
  reward
  slots
  description
  createdAt
}
    `;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  username
  level
  experience
}
    `;
export const CreateQuestDocument = gql`
    mutation createQuest($id: String!, $creatorId: String!) {
  createQuest(id: $id, creatorId: $creatorId)
}
    `;

export function useCreateQuestMutation() {
  return Urql.useMutation<CreateQuestMutation, CreateQuestMutationVariables>(CreateQuestDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($userId: String!) {
  createUser(userId: $userId)
}
    `;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const PublishQuestDocument = gql`
    mutation PublishQuest($id: String!) {
  publishQuest(id: $id)
}
    `;

export function usePublishQuestMutation() {
  return Urql.useMutation<PublishQuestMutation, PublishQuestMutationVariables>(PublishQuestDocument);
};
export const UpdateQuestAttributesDocument = gql`
    mutation UpdateQuestAttributes($updateQuestTransactions: [UpdateQuestTransaction]!) {
  updateQuestAttributes(updateQuestTransactions: $updateQuestTransactions)
}
    `;

export function useUpdateQuestAttributesMutation() {
  return Urql.useMutation<UpdateQuestAttributesMutation, UpdateQuestAttributesMutationVariables>(UpdateQuestAttributesDocument);
};
export const UpdateQuestDescriptionDocument = gql`
    mutation UpdateQuestDescription($questId: String!, $description: String!) {
  updateQuestDescription(questId: $questId, description: $description)
}
    `;

export function useUpdateQuestDescriptionMutation() {
  return Urql.useMutation<UpdateQuestDescriptionMutation, UpdateQuestDescriptionMutationVariables>(UpdateQuestDescriptionDocument);
};
export const PublishedQuestDocument = gql`
    query PublishedQuest($id: String!) {
  publishedQuest(id: $id) {
    ...Quest
  }
}
    ${QuestFragmentDoc}`;

export function usePublishedQuestQuery(options: Omit<Urql.UseQueryArgs<PublishedQuestQueryVariables>, 'query'>) {
  return Urql.useQuery<PublishedQuestQuery, PublishedQuestQueryVariables>({ query: PublishedQuestDocument, ...options });
};
export const PublishedQuestsDocument = gql`
    query PublishedQuests($after: LastEvaluatedKey) {
  publishedQuests(after: $after) {
    nodes {
      ...Quest
    }
    pageInfo {
      endCursor {
        id
        title
        creatorId
      }
      hasNextPage
    }
  }
}
    ${QuestFragmentDoc}`;

export function usePublishedQuestsQuery(options?: Omit<Urql.UseQueryArgs<PublishedQuestsQueryVariables>, 'query'>) {
  return Urql.useQuery<PublishedQuestsQuery, PublishedQuestsQueryVariables>({ query: PublishedQuestsDocument, ...options });
};
export const UserByIdDocument = gql`
    query UserById($id: String!) {
  userById(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useUserByIdQuery(options: Omit<Urql.UseQueryArgs<UserByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<UserByIdQuery, UserByIdQueryVariables>({ query: UserByIdDocument, ...options });
};
export const WorkspaceQuestAndSolutionListVersionDocument = gql`
    query WorkspaceQuestAndSolutionListVersion($userId: String!) {
  workspaceQuestAndSolutionListVersion(userId: $userId)
}
    `;

export function useWorkspaceQuestAndSolutionListVersionQuery(options: Omit<Urql.UseQueryArgs<WorkspaceQuestAndSolutionListVersionQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceQuestAndSolutionListVersionQuery, WorkspaceQuestAndSolutionListVersionQueryVariables>({ query: WorkspaceQuestAndSolutionListVersionDocument, ...options });
};
export const WorkspaceQuestDocument = gql`
    query WorkspaceQuest($questId: String!, $userId: String!) {
  workspaceQuest(questId: $questId, userId: $userId) {
    ...Quest
  }
}
    ${QuestFragmentDoc}`;

export function useWorkspaceQuestQuery(options: Omit<Urql.UseQueryArgs<WorkspaceQuestQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceQuestQuery, WorkspaceQuestQueryVariables>({ query: WorkspaceQuestDocument, ...options });
};
export const WorkspaceQuestAndSolutionListDocument = gql`
    query workspaceQuestAndSolutionList($userId: String!) {
  workspaceQuestAndSolutionList(userId: $userId) {
    id
    title
    topic
    inTrash
    version
  }
}
    `;

export function useWorkspaceQuestAndSolutionListQuery(options: Omit<Urql.UseQueryArgs<WorkspaceQuestAndSolutionListQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceQuestAndSolutionListQuery, WorkspaceQuestAndSolutionListQueryVariables>({ query: WorkspaceQuestAndSolutionListDocument, ...options });
};
export const QuestCreatedDocument = gql`
    subscription QuestCreated($publisherId: String!) {
  questPublished(publisherId: $publisherId) {
    ...Quest
  }
}
    ${QuestFragmentDoc}`;

export function useQuestCreatedSubscription<TData = QuestCreatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<QuestCreatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<QuestCreatedSubscription, TData>) {
  return Urql.useSubscription<QuestCreatedSubscription, TData, QuestCreatedSubscriptionVariables>({ query: QuestCreatedDocument, ...options }, handler);
};