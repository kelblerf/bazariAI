export const toListingOwnerInput = (user) => ({
  userId: user.id,
  userEmail: user.email || null,
});
