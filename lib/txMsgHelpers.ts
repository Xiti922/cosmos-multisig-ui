import { EncodeObject } from "@cosmjs/proto-signing";
import {
  MsgType,
  TxMsg,
  TxMsgClaimRewards,
  TxMsgDelegate,
  TxMsgRedelegate,
  TxMsgSend,
  TxMsgSetWithdrawAddress,
  TxMsgUndelegate,
} from "../types/txMsg";

const isTxMsgSend = (msg: TxMsg): msg is TxMsgSend =>
  msg.typeUrl === "/cosmos.bank.v1beta1.MsgSend" &&
  "value" in msg &&
  "fromAddress" in msg.value &&
  "toAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.fromAddress &&
  !!msg.value.toAddress &&
  !!msg.value.amount.length;

const isTxMsgDelegate = (msg: TxMsg): msg is TxMsgDelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress &&
  !!msg.value.amount;

const isTxMsgUndelegate = (msg: TxMsg): msg is TxMsgUndelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress &&
  !!msg.value.amount;

const isTxMsgRedelegate = (msg: TxMsg): msg is TxMsgRedelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgBeginRedelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorSrcAddress" in msg.value &&
  "validatorDstAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorSrcAddress &&
  !!msg.value.validatorDstAddress &&
  !!msg.value.amount;

const isTxMsgClaimRewards = (msg: TxMsg): msg is TxMsgClaimRewards =>
  msg.typeUrl === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress;

const isTxMsgSetWithdrawAddress = (msg: TxMsg): msg is TxMsgSetWithdrawAddress =>
  msg.typeUrl === "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "withdrawAddress" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.withdrawAddress;

const isEncodeObject = (msg: TxMsg): msg is EncodeObject =>
  "typeUrl" in msg && "value" in msg && !!msg.typeUrl && !!msg.value;

const isUnknownEncodeObject = (msg: TxMsg): msg is EncodeObject =>
  isEncodeObject(msg) &&
  !isTxMsgSend(msg) &&
  !isTxMsgDelegate(msg) &&
  !isTxMsgUndelegate(msg) &&
  !isTxMsgRedelegate(msg) &&
  !isTxMsgClaimRewards(msg) &&
  !isTxMsgSetWithdrawAddress(msg);

const gasOfMsg = (msgType: MsgType): number => {
  switch (msgType) {
    case "send":
      return 100_000;
    case "delegate":
      return 100_000;
    case "undelegate":
      return 100_000;
    case "redelegate":
      return 100_000;
    case "claimRewards":
      return 100_000;
    case "setWithdrawAddress":
      return 100_000;
    case "encodeObject":
      return 100_000;
    default:
      throw new Error("Unknown msg type");
  }
};

const gasOfTx = (msgTypes: readonly MsgType[]): number => {
  const txFlatGas = 100_000;
  const totalTxGas = msgTypes.reduce((acc, msgType) => acc + gasOfMsg(msgType), txFlatGas);
  return totalTxGas;
};

export {
  isTxMsgSend,
  isTxMsgDelegate,
  isTxMsgUndelegate,
  isTxMsgRedelegate,
  isTxMsgClaimRewards,
  isTxMsgSetWithdrawAddress,
  isEncodeObject,
  isUnknownEncodeObject,
  gasOfMsg,
  gasOfTx,
};
