export const RESOURCE_META = {
    providers: {
        singular: "provider",
        parent: "service",
    },
    bookings: {
        singular: "booking",
        parent: "user",
    },
    services: {
        singular: "service",
        parent: "user",
    },
    users: {
        singular: "user",
        parent: null,
    },
    "provider-working-hours": {
        singular: "provider-working-hour",
        parent: null
    }
} as const;

type Meta = typeof RESOURCE_META;

export type ResourceName = keyof Meta;

export const API_RESOURCES: {
    [K in ResourceName]: {
        singular: string;
        parent: string | null;
        base: string;
        byId: (id: number) => string;
        byParent?: (parentId: number) => string;
    };
} = Object.fromEntries(
    Object.entries(RESOURCE_META).map(([key, meta]) => {
        const base = `${meta.singular}s`; // pluralize automatically

        return [
            key,
            {
                ...meta,
                base,
                byId: (id: number) => `${base}/${id}`,
                byParent: meta.parent
                    ? (parentId: number) =>
                        `${base}/${meta.parent}s/${parentId}`
                    : undefined,
            },
        ];
    })
) as any;
