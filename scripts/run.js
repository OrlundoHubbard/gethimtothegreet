const main = async () => {
  const greeterContractFactory = await hre.ethers.getContractFactory('GreeterPortal');
  const greeterContract = await greeterContractFactory.deploy();
  await greeterContract.deployed();
  console.log('Contract addy:', greeterContract.address);

  let greetingCount;
  greetingCount = await greeterContract.getTotalGreetings();
  console.log(greetingCount.toNumber());

  let greetingTxn = await greeterContract.greet('A message!');
  await greetingTxn.wait();

  greetingCount = await greeterContract.getTotalGreetings();

  const [_, randomPerson] = await hre.ethers.getSigners();
  greetingTxn = await greeterContract.connect(randomPerson).greet('Another message!');
  await greetingTxn.wait();

  let allGreetings = await greeterContract.getAllGreetings();
  console.log(allGreetings);
};

const runMain = async () => {
  try {
      await main();
      process.exit(0);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
};

runMain();
