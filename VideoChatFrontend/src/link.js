export const link = {
  baseUrl:
    process.env.REACT_APP_URL == undefined
      // ? "http://localhost:8080"
      ? "http://192.168.68.110:8080"
      : process.env.REACT_APP_URL,
}