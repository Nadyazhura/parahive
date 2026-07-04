function profile(user) {
  return user.pilotProfile;
}

export function presentPublicPilot(user) {
  return {
    id: user.id,
    fullName: profile(user)?.fullName ?? null,
    rankCode: profile(user)?.rankCode ?? null,
    pilotStatusCode: profile(user)?.statusCode ?? null,
  };
}

export function presentExtendedPilot(user) {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    roleCode: user.roleCode,
    blocked: user.blocked,
    fullName: profile(user)?.fullName ?? null,
    phone: profile(user)?.phone ?? null,
    telegram: profile(user)?.telegram ?? null,
    pilotStatusCode: profile(user)?.statusCode ?? null,
    rankCode: profile(user)?.rankCode ?? null,
  };
}

export function presentFullPilot(user) {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    roleCode: user.roleCode,
    blocked: user.blocked,
    mustChangePassword: user.mustChangePassword,
    profile: profile(user)
      ? {
          id: profile(user).id,
          fullName: profile(user).fullName,
          birthDate: profile(user).birthDate,
          latinFullName: profile(user).latinFullName,
          phone: profile(user).phone,
          telegram: profile(user).telegram,
          address: profile(user).address,
          emergencyContactName: profile(user).emergencyContactName,
          emergencyContactPhone: profile(user).emergencyContactPhone,
          pilotStatusCode: profile(user).statusCode,
          rankCode: profile(user).rankCode,
          parapro: profile(user).parapro,
          serviceNotes: profile(user).serviceNotes,
          createdAt: profile(user).createdAt,
          updatedAt: profile(user).updatedAt,
        }
      : null,
  };
}
