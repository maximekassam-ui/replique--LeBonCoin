"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAll(ctx) {
    try {
      const offersIdToDelete = ctx.request.params.id; //1
      const body = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        offersIdToDelete,
        { populate: ["offers"] }
      );
      const allOffers = body.offers;

      for (let i = 0; i < allOffers.length; i++) {
        await strapi.entityService.delete("api::offer.offer", allOffers[i].id);
      }
      return { message: "All offers have been deleted" };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
  async create(ctx) {
    try {
      const userId = ctx.state.user.id; //id de l'utilisateur qui fait la requete
      const offer = ctx.request.body.data;
      const objOffer = JSON.parse(offer);
      const ownerOffer = objOffer.owner; //1 id du propriétaire de l'offre
      const requestBody = { data: objOffer };

      if (userId !== ownerOffer) {
        ctx.response.status = 403;
        return { message: "The offer have to be yours !" };
      } else {
        const { data, meta } = await super.create(ctx);
        return { data, meta };
      }
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));

//recuperer l'id de l'utilisateur des offres a supp
//recuperer le body de cet utilisateur
//populate les offres de cet utilisateur
