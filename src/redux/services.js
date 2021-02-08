export const authHeader = () => {
  if (localStorage.getItem("ud")) {
    const st = localStorage.getItem("ud");
    const ud = JSON.parse(st);
    return { Authorization: `Bearer ${ud.token}` };
  }
  return null;
};
