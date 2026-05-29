module.exports = async (policyContext, config, { strapi }) => {
  const userId = policyContext.state.user.id; //1 id de l'utilsateur qui fait le requete
  const offerId = policyContext.request.params.id; //9 id de l'offre que l'on veut modifier
  const offerPopulate = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    { populate: ["owner"] }
  );

  const ownerOfferId = offerPopulate.owner.id;

  if (ownerOfferId !== userId) {
    return false;
  } else {
    return true;
  }
};

// récupère l'id de l'utilisateur qui fait la requête
// récupère l'id de l'offre, envoyé en params
// va chercher l'offre en question, via l'Entity Service API, et déploie sa clef owner
// si l'id du propriétaire n'est pas le même que l'id de la personne qui fait la requête, renvoyer une erreur, passer à la suite sinon
