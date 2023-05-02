export type ProfileType = "Person" | "Organization"|"Import"|"Signup";

export interface CirclesSafe {
    /**
     * Contains the type of the profile (Person or Organization)
     */
    type: ProfileType;
    /**
     * Contains the address of the safe
     */
    safeAddress:string;
    /**
     * Contains the address of the imported safe owner (the safe can have multiple owners)
     */
    ownerAddress:string;
    /**
     * The Circles profile name for the safe address (from the circles.garden api)
     */
    userName:string;
    /**
     * The Circles profile image for the safe address (from the circles.garden api)
     */
    userAvatar:string;
}
