// export const typeDefs = `#graphql
//     type Game{
//         id: ID!
//         title: String!
//         platform: [String!]!
//         reviews: [Review!]
//     }
//     type Review{
//         id: ID!
//         rating: Int!
//         content: String!
//         game: Game!
//         author: Author!
//     }
//     type Author{
//         id: ID!
//         name: String!
//         verified: Boolean!
//         reviews: [Review!]
//     }
//     type User{
//         id: ID!
//         email:String!
//         password: String!
//         role: String!
//         createdDate: String!
//         storeId: Int
//         status: String!
//     }
//     type Query{
//         reviews: [Review]
//         review(id:ID!): Review
//         games: [Game]
//         game(id:ID!): Game
//         authors: [Author]
//         author(id:ID!): Author
//         users: [User]
//         user(id:ID!): User
//     }
//     type Mutation{
//         deleteGame(id:ID!): [Game]
//         addGame(game:AddGameInput!): Game
//         updateGame(id:ID!, game:UpdateGameInput!): Game
//     }
//     input AddGameInput{
//         title:String!
//         platform: [String!]!
//     }
//     input UpdateGameInput{
//         title:String
//         platform: [String!]
//     }
// `;

export const typeDefs = `#graphql
    type Customer{
        id:ID!
        first_name:String!
        last_name:String!
        telephone_no:String
        date_of_birth: String
        customer_ref_code:String
        userId:Int
        commonAddress: CommonAddress
        identification: CustomerIdentification
    }
    type CommonAddress{
        id:ID!
        building_no: String!
        street:String!
        city:String!
        postal_code:Int!
    }
    type CustomerIdentification{
        id: ID!
        identification_no:String!
        identificationType:IdentificationType
    }
    type IdentificationType{
        id:ID!
        name: String!
    }
    type Query{
        customers: [Customer]
        commonAddresses: [CommonAddress]
    }
`;
