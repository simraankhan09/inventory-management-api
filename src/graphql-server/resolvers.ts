import {
  getAddressById,
  getIdentificationById,
  getAllCustomers,
  getIdentificationTypeById,
  getCustomerById,
} from "./db";

// export const resolvers = {
//   Query: {
//     games: () => {
//       return games;
//     },
//     reviews: () => {
//       return reviews;
//     },
//     authors: () => {
//       return authors;
//     },
//     users: async () => {
//       return await getUsers();
//     },
//     review: (parent: any, args: any, context: any) => {
//       return reviews.find((review) => review.id === args.id);
//     },
//     game: (parent: any, args: any, context: any) => {
//       return games.find((game) => game.id === args.id);
//     },
//     author: (parent: any, args: any, context: any) => {
//       return authors.find((author) => author.id === args.id);
//     },
//     user: async (parent: any, args: any, context: any) => {
//       return await getUserById(args.id);
//     },
//   },
//   Game: {
//     // parent - game obect
//     reviews: (parent: any) => {
//       return reviews.filter((review) => review.game_id === parent.id);
//     },
//   },
//   Author: {
//     // parent - game obect
//     reviews: (parent: any) => {
//       return reviews.filter((review) => review.author_id === parent.id);
//     },
//   },
//   Mutation: {
//     deleteGame: (_: any, args: any) => {
//       return games.filter((g) => g.id !== args.id);
//     },
//     addGame: (_: any, args: any) => {
//       const newGame = {
//         id: games.length + 1,
//         title: args.game.title,
//         platform: args.game.platform,
//       };
//       return newGame;
//     },
//     updateGame: (_: any, args: any) => {
//       const game = games.find((g) => g.id === args.id);
//       if (game && args.game?.title && args.game?.platform) {
//         game.title = args.game.title;
//         game.platform = args.game.pal;
//       }
//       return game;
//     },
//   },
// };

export const resolvers = {
  Query: {
    customers: async () => {
      return await getAllCustomers();
    },
    customer: async (_: any, args: any) => {
      return await getCustomerById(args.id);
    },
  },
  Customer: {
    commonAddress: async (parent: any) => {
      return await getAddressById(parent.common_address_id);
    },
    identification: async (parent: any) => {
      return await getIdentificationById(parent.identification_id);
    },
  },
  CustomerIdentification: {
    identificationType: async (parent: any) => {
      return await getIdentificationTypeById(parent.identification_type_id);
    },
  },
};
