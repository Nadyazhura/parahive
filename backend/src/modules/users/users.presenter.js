function presentPilotProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.fullName,
    birthDate: profile.birthDate,
    latinFullName: profile.latinFullName,
    phone: profile.phone,
    telegram: profile.telegram,
    address: profile.address,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
    pilotStatusCode: profile.statusCode,
    rankCode: profile.rankCode,
    parapro: profile.parapro,
    serviceNotes: profile.serviceNotes,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function presentManagedUser(user) {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    roleCode: user.roleCode,
    blocked: user.blocked,
    mustChangePassword: user.mustChangePassword,
    passwordChangedAt: user.passwordChangedAt,
    failedLoginAttempts: user.failedLoginAttempts,
    lockedUntil: user.lockedUntil,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profile: presentPilotProfile(user.pilotProfile),
  };
}

export function presentManagedUsers(users) {
  return users.map(presentManagedUser);
}
