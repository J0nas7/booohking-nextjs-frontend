import { ServerAuth } from '@/layout/ServerAuth'
import { AdminBookingsPage } from '@/views'

const Page = () => (
    <ServerAuth>
        <AdminBookingsPage />
    </ServerAuth>
)

export default Page
