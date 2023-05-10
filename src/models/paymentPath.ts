export type PaymentPath = {
    requestedAmount: string,
    maxFlow: string,
    path: {
        from:string,
        to:string,
        tokenOwner:string,
        value:string
    }[]
};
