import contract from "@truffle/contract";

export const loadContracts = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const _contract = contract(Artifact);
  _contract.setProvider(provider);

  const _deployedContract = await _contract.deployed();

  return _deployedContract;
};
