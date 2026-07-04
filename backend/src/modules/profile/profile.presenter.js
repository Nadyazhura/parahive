export function presentMyProfile(user) {
  const profile = user.pilotProfile;

  return {
    user: {
      id: user.id,
      login: user.login,
      email: user.email,
      roleCode: user.roleCode,
      blocked: user.blocked,
      mustChangePassword: user.mustChangePassword,
    },
    profile: profile
      ? {
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
        }
      : null,
  };
}
