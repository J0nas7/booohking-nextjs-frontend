// Internal
import { useResourceAPI } from "@/hooks/useResourceAPI"

// Generic context and provider to handle different resources.
export const useResourceContext = <T extends { [key: string]: any }, IDKey extends keyof T>(
    resource: string,
    idFieldName: IDKey,
    parentResource: string
) => {
    const { getItems, getItemsByParent, getItem, postItem, putItem, deleteItem } = useResourceAPI<T, IDKey>(resource, idFieldName, parentResource)

    const indexItems = async () => {
        const data = await getItems() // Fetch all items

        if (!data || data.code == "ERR_BAD_REQUEST" || data.name == "AxiosError") {
            return false
        }

        return data ?? { data: [], nextPage: undefined };
    }

    const indexItemsById = async (parentId: number) => {
        const data = await getItemsByParent(parentId) // Fetch all items by parentId

        if (!data || data.code == "ERR_BAD_REQUEST" || data.name == "AxiosError") {
            return false
        }

        return data ?? { data: [], nextPage: undefined };
    }

    const showItem = async (itemId: number) => {
        const data = await getItem(itemId) // Fetch item by id
        if (!data || data.code == "ERR_BAD_REQUEST" || data.name == "AxiosError") {
            return false
        }

        return data
    }

    const storeItem = async (parentId: number, object?: T) => {
        if (object) {
            const createdItem = await postItem(object)

            if (createdItem) {
                return createdItem as unknown as T
            }
        }
        return false
    }

    const updateItem = async (itemChanges: T, parentId: number) => {
        const updatedItem = await putItem(itemChanges)
        return updatedItem
    }

    const destroyItem = async (itemId: number, parentId: number, redirect: string | undefined) => {
        const success = await deleteItem(itemId, redirect)
    }

    return {
        indexItems,
        indexItemsById,
        showItem,
        destroyItem,
        storeItem,
        updateItem,
    }
}
