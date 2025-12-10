"use client"

// External
import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Internal
import { useAxios } from "@/hooks";
import {
    selectDeleteConfirm,
    setDeleteConfirm,
    setIsDeletingItem,
    setSnackMessage,
    useAppDispatch,
    useTypedSelector
} from "@/redux";
import { API_RESOURCES, ResourceName } from '@/types';

interface APIResponse<T> {
    data: T;
    message?: string;
}

// Define the ID field constraint with a dynamic key
type HasIDField<T, IDKey extends string> = T & {
    [key in IDKey]: number; // Define the dynamic ID field based on the resource
};

// A generic hook for handling API operations on different resources
export const useResourceAPI = <T extends { [key: string]: any }, IDKey extends keyof T>(
    resource: ResourceName,
    idFieldName: IDKey,
    parentResource: string
) => {
    // Hooks
    const resourceConfig = API_RESOURCES[resource];
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { httpGetRequest, httpPostWithData, httpPutWithData, httpDeleteRequest } = useAxios()

    // State
    const deleteConfirm = useTypedSelector(selectDeleteConfirm)

    // Fetch items (R in CRUD)
    const getItems = async () => {
        const endpoint = resourceConfig.base
        try {
            const data = await httpGetRequest(endpoint)
            console.log(`getItems ${endpoint}`, data)

            if (data) return data

            throw new Error(`Failed to getItems ${endpoint}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while getItems ${endpoint}.`);
            return false;
        }
    };

    // Fetch items by parent ID (R in CRUD)
    const getItemsByParent = async (parentId: number) => {
        const endpoint = resourceConfig.byParent?.(parentId)
        try {
            const data = await httpGetRequest(endpoint || "")
            console.log(`getItemsByParent ${endpoint}`, data)

            if (data) return data

            throw new Error(`Failed to getItemsByParent ${endpoint}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while getItemsByParent ${endpoint}.`);
            return false;
        }
    };

    // Fetch a single item (R in CRUD)
    const getItem = async (itemId: number) => {
        const endpoint = resourceConfig.byId(itemId)
        try {
            const data = await httpGetRequest(endpoint)
            console.log(`getItem ${endpoint}`, data)

            if (data) return data

            throw new Error(`Failed to getItem ${endpoint}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while getItem ${endpoint}.`);
            return false;
        }
    };

    // Create a new item (C in CRUD)
    const postItem = async (newItem: Omit<T, IDKey>) => {
        const endpoint = resourceConfig.base
        try {
            const data: APIResponse<T> = await httpPostWithData(endpoint, newItem);
            console.log(`postItem ${endpoint}`, data)

            if (data) return data

            throw new Error(`Failed to postItem ${endpoint}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while postItem ${endpoint}.`);
            return false;
        }
    };

    // Update an existing item (U in CRUD)
    const putItem = async (updatedItem: T) => {
        const idOfItem = updatedItem[idFieldName];
        const endpoint = resourceConfig.byId(idOfItem as any)
        try {
            const data: APIResponse<T> = await httpPutWithData(endpoint, updatedItem);

            console.log(`putItem ${endpoint}`, data)
            if (!data.message) return true;

            throw new Error(`Failed to putItem ${endpoint}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while putItem ${endpoint}.`);
            return false;
        }
    };

    // Delete an item (D in CRUD)
    const deleteItem = async (itemId: number, redirect: string | undefined) => {
        let singular = resource as string
        if (resource.endsWith("s")) singular = resource.slice(0, -1)

        dispatch(setDeleteConfirm({ singular, resource, itemId, confirm: undefined, redirect }))
    }

    const deleteOrNot = async () => {
        if (
            deleteConfirm &&
            deleteConfirm.confirm &&
            deleteConfirm.resource === resource &&
            deleteConfirm.itemId
        ) {
            const endpoint = resourceConfig.byId(deleteConfirm.itemId);
            try {
                const data = await httpDeleteRequest(endpoint);
                console.log(`deleteItem ${endpoint}`, data)

                if (!data.message) {
                    throw new Error(`Failed to deleteItem ${endpoint}`);
                }

                // Show success message
                dispatch(setSnackMessage(`
                    ${deleteConfirm.singular.charAt(0).toUpperCase()}${deleteConfirm.singular.slice(1)}
                    deleted successfully
                `));

                // Redirect if specified
                if (deleteConfirm.redirect) window.location.replace(deleteConfirm.redirect);
            } catch (error: any) {
                console.log(error.message || `An error occurred while deleteItem ${endpoint}.`);
                // Show error message
                dispatch(setSnackMessage(`Failed to delete ${deleteConfirm.singular}`));
            }

            dispatch(setDeleteConfirm(undefined))
            dispatch(setIsDeletingItem(deleteConfirm.resource))
        } else if (
            deleteConfirm &&
            deleteConfirm.confirm === false
        ) {
            // User cancelled the delete action
            dispatch(setDeleteConfirm(undefined))
        }
    }

    const { mutate: doDelete, isPending: isDeletingItem } = useMutation({
        mutationFn: () => deleteOrNot(),
    })

    // Effects
    useEffect(() => {
        if (deleteConfirm && deleteConfirm.confirm !== undefined) {
            doDelete()
        }
    }, [deleteConfirm])

    useEffect(() => {
        if (isDeletingItem === true) {
            dispatch(setIsDeletingItem(isDeletingItem))
        }
    }, [isDeletingItem])

    return {
        getItems,
        getItemsByParent,
        getItem,
        postItem,
        putItem,
        deleteItem
    };
};
