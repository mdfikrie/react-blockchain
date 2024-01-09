import contract from "@truffle/contract";

export const loadContracts = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const _contract = contract(Artifact);
  _contract.setProvider(provider);

  let _deployedContract = null;

  try {
    _deployedContract = await _contract.deployed();
  } catch {
    console.error("You are connected to wrong network");
  }

  return _deployedContract;
};
