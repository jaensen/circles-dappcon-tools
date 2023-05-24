export type PaymentPathTransfer = {
    from: string,
    to: string,
    token: string,
    tokenOwner: string,
    value: string
}

export type PaymentPath = {
    requestedAmount: string,
    maxFlow: string,
    path: PaymentPathTransfer[]
};
