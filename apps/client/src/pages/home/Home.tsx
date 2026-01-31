import MailBridge from "@/widgets/mail-bridge/MailBridge";
import TokenBridge from "@/widgets/token-bridge/TokenBridge";
import { Box, Container, Flex, RadioCards } from "@radix-ui/themes";
import { useState } from "react";

function Home() {
  const [mode, setMode] = useState("token");

  return (
    <Container size="4">
      <Flex
        direction="column"
        gap={{
          initial: "2",
          md: "8",
        }}
      >
        <RadioCards.Root gap="2" size="1" columns="2" defaultValue={mode} onValueChange={setMode}>
          <RadioCards.Item value="token">Tokens</RadioCards.Item>
          <RadioCards.Item value="mail">Messages</RadioCards.Item>
        </RadioCards.Root>

        <Box>{mode === "token" ? <TokenBridge /> : <MailBridge />}</Box>
      </Flex>
    </Container>
  );
}

export default Home;
