import { TokenHolder } from "covalent-sdk";
import { Content, Notification } from "react-bulma-components";

interface TokenHoldersProps {
  holders: TokenHolder[];
}

function TokenHolders({ holders }: TokenHoldersProps) {
  if (holders.length === 0) {
    return (
      <Notification color="warning">No holders found.</Notification>
    );
  }

  return (
    <Content>
      <ul>
        { holders.map(holder => {
          return (
            <li key={holder.address}>{ holder.address }</li>
          );
        })}
      </ul>
    </Content>
  );
}

export default TokenHolders;
