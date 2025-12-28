declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_AI_URL?: string;
    readonly VITE_KEYCLOAK_URL?: string;
    readonly VITE_KEYCLOAK_REALM?: string;
    readonly VITE_KEYCLOAK_CLIENT_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}