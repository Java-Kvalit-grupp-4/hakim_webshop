const saveJwtToLocalStorage = (jwtToken) => {
  localStorage.setItem("jwt", JSON.stringify(jwtToken));
};

const getJwtTokenFromLocalstorage = () => {
  return JSON.parse(localStorage.getItem("jwt"));
};

const getHeaderObjWithAuthorization = () => {
  return (config = {
    headers: {
      Authorization: getJwtTokenFromLocalstorage(),
    },
  });
};
