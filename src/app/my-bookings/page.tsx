import { ServerAuth } from '@/layout/ServerAuth'
import { MyBookingsPage } from '@/views'

const Page = () => (
    <ServerAuth>
        <MyBookingsPage />
    </ServerAuth>
)

export default Page
