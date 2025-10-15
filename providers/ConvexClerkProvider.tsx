'use client'

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

const EnsureUserOnAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isSignedIn } = useUser();
    const ensureUser = useMutation(api.users.ensureUser);

    useEffect(() => {
        if (!isSignedIn) return;
        // Fire and forget; errors will show in console but shouldn't block UI
        void ensureUser({}).catch(() => {});
    }, [isSignedIn, ensureUser]);

    return <>{children}</>;
};

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
    //appearance are used to change the look of the clerk sign/signup page
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as
        string} appearance={{
            layout: {
                socialButtonsVariant: 'iconButton',
                logoImageUrl: '/icons/logo.png' //also adds project name+home page link
            },
            variables: {
                colorBackground: '#15171c',
                colorPrimary: '',
                colorText: 'white',
                colorInputBackground: '#1b1f29',
                colorInputText: 'white',
            }
        }}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <EnsureUserOnAuth>
                {children}
            </EnsureUserOnAuth>
        </ConvexProviderWithClerk>
    </ClerkProvider>
);

export default ConvexClerkProvider;