export function presentUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    login: user.login,
    email: user.email,
    blocked: user.blocked,
    mustChangePassword: user.mustChangePassword,
    role: user.role
      ? {
          code: user.role.code,
        }
      : null,
    profile: user.pilotProfile
      ? {
          id: user.pilotProfile.id,
          fullName: user.pilotProfile.fullName,
          birthDate: user.pilotProfile.birthDate,
          latinFullName: user.pilotProfile.latinFullName,
          phone: user.pilotProfile.phone,
          telegram: user.pilotProfile.telegram,
          address: user.pilotProfile.address,
          emergencyContactName: user.pilotProfile.emergencyContactName,
          emergencyContactPhone: user.pilotProfile.emergencyContactPhone,
          statusCode: user.pilotProfile.statusCode,
          rankCode: user.pilotProfile.rankCode,
          parapro: user.pilotProfile.parapro,
          serviceNotes: user.pilotProfile.serviceNotes,
        }
      : null,
  };
}
