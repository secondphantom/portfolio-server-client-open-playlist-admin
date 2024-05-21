const run = async () => {
  setTimeout(() => {
    fetch("https://admin.openplaylist.net")
      .then(() => console.log("success fetch"))
      .catch(console.log);
  }, 5000);
};

run();
