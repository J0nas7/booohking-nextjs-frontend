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
    resource: string,
    idFieldName: IDKey,
    parentResource: string
) => {
    // Hooks
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { httpGetRequest, httpPostWithData, httpPutWithData, httpDeleteRequest } = useAxios()

    // State
    const deleteConfirm = useTypedSelector(selectDeleteConfirm)

    // Fetch items (R in CRUD)
    const getItems = async () => {
        try {
            const data = await httpGetRequest(`${resource}`)

            if (data) return data

            throw new Error(`Failed to getItems ${resource}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while fetching ${resource}.`);
            return false;
        }
    };

    // Fetch items by parent ID (R in CRUD)
    const getItemsByParent = async (parentId: number) => {
        try {
            // : APIResponse<T[]>
            const data = await httpGetRequest(`${resource}/${parentResource}/${parentId}`)
            console.log(`${resource}/${parentResource}/${parentId}`, data)

            if (data) return data

            throw new Error(`Failed to getItemsByParent ${resource}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while fetching ${parentResource}.`);
            return false;
        }
    };

    // Fetch a single item (R in CRUD)
    const getItem = async (itemId: number) => {
        try {
            // : APIResponse<T>
            const response = await httpGetRequest(`${resource}/${itemId}`)
            // console.log(`fetch${resource}`, response)

            if (response) return response

            throw new Error(`Failed to getItem ${resource}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while fetching the ${resource}.`);
            return false;
        }
    };

    // Create a new item (C in CRUD)
    const postItem = async (newItem: Omit<T, IDKey>) => {
        try {
            const response: APIResponse<T> = await httpPostWithData(resource, newItem);

            console.log(`${resource} postItem`, response)
            if (response) return response

            throw new Error(`Failed to add ${resource}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while adding the ${resource}.`);
            return false;
        }
    };

    // Update an existing item (U in CRUD)
    const putItem = async (updatedItem: T) => {
        try {
            const response: APIResponse<T> = await httpPutWithData(`${resource}/${updatedItem[idFieldName]}`, updatedItem);

            console.log(`${resource} putItem`, response)
            if (!response.message) return true;

            throw new Error(`Failed to update ${resource}`);
        } catch (error: any) {
            console.log(error.message || `An error occurred while updating the ${resource}.`);
            return false;
        }
    };

    // Delete an item (D in CRUD)
    const deleteItem = async (itemId: number, redirect: string | undefined) => {
        let singular = resource
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
            try {
                const response = await httpDeleteRequest(`${deleteConfirm.resource}/${deleteConfirm.itemId}`);
                console.log("doDelete", response)

                if (!response.message) {
                    throw new Error(`Failed to delete ${deleteConfirm.resource}`);
                }

                // Show success message
                dispatch(setSnackMessage(`
                    ${deleteConfirm.singular.charAt(0).toUpperCase()}${deleteConfirm.singular.slice(1)}
                    deleted successfully
                `));

                // Redirect if specified
                if (deleteConfirm.redirect) window.location.replace(deleteConfirm.redirect);
            } catch (error: any) {
                console.log(error.message || `An error occurred while deleting the ${resource}.`);
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
