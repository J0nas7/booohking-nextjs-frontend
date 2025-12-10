import { ServerAuth } from '@/layout/ServerAuth'
import { BookingProviderPage } from '@/views'

const Page = () => (
    <ServerAuth>
        <BookingProviderPage />
    </ServerAuth>
)

export default Page
