module.exports = (userRoles, permission, channelID) => {
  const topRole = userRoles[userRoles.length - 1];
  let activePremissionSet;
  if (channelID) {
    activePremissionSet = topRole.permissionSets.find(set => set._id === channelID);
  }
  if (!activePremissionSet) activePremissionSet = topRole.permissionSets[0];

  console.log(activePremissionSet);
  if (activePremissionSet.permissions[permission]) {
    return true;
  }
  return false;
};
