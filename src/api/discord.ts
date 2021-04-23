import { IRollSkillProps, RollProps } from '../contexts/GameContext';

const failString = `\`\`\`diff
- Fail
\`\`\``

const successString = `\`\`\`diff
+ Success
\`\`\``

const rollString = ({rollerName = "Character", discordDescription = "rolls", discordResult, total = 0, success}:RollProps) => {
  console.log("discordResult",discordResult)
  const resultText = discordResult ?? `**${total}**`
  console.log("resultText",resultText)
  return `\n**${rollerName}** ${discordDescription}
  > Result: 
  > ${resultText}
  ${discordResult
    ? ``
    : success
      ? successString
      : failString}
      `;
};

export async function discordWebhook(props: RollProps) {


  const content = rollString(props)
  const requestOptions = {
    method : 'POST',
    headers: {'Content-Type': 'application/json'},
    body   : JSON.stringify({
      username: `Rollerbot`,
      content,
    }),
  };

  fetch(
      'https://discord.com/api/webhooks/827982601712435221/FqfPOT5svA0seeDUHFvoNaxHdSq7omtT4JiI2dccdX9vLaS8usvvyHEWdMmZc2Zl_E-n',
      requestOptions)
      .catch((e) => console.log(e));

console.log(content)

}

export async function abilityWebhook(props: IRollSkillProps, roll: number[]) {
  const {
    rollerName,
    target,
    rolledSkill,
    dice,
  } = props;

  const total = roll.reduce((prev, curr) => prev + curr, 2);

  const diceEmbeds: any[] = [];

  roll.forEach(die => {
    diceEmbeds.push({
      image: {
        url: `https://troika-online.vercel.app/dice/${die + 1}.png`,
      },
    });
  });

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: `Rollerbot`,
      content : `**${rollerName}** ${target == 0
                                     ? `rolling ${dice.length}d6`
                                     : target === undefined
                                       ? `tests ${rolledSkill}`
                                       : `rolling under **${target}** for **${rolledSkill}**`}
> Result: 
> **${total}**
${target
  ? total > target
    ? `\`\`\`diff
- Fail
\`\`\``
    : `\`\`\`diff
+ Success
\`\`\``
  : ''}\n`, // embeds  : diceEmbeds,
    }),
  };

  fetch(
      'https://discord.com/api/webhooks/827982601712435221/FqfPOT5svA0seeDUHFvoNaxHdSq7omtT4JiI2dccdX9vLaS8usvvyHEWdMmZc2Zl_E-n',
      requestOptions)
      .then(response => console.log(response));
}

