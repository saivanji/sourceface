export function execute({ endpoint, key }) {
  const result = store.endpoints[endpoint][key];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, Math.random() * 1000);
  });
}

const store = {
  endpoints: {
    about: {
      content: "We are a small company which does big things",
      email: "yourfriends@startup.io"
    },
    meta: {
      units: "px"
    }
  }
};
