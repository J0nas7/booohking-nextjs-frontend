import { ServerAuth } from '@/layout/ServerAuth'
import { ServicePage } from '@/views'

const Page = () => (
    <ServerAuth>
        <ServicePage />
    </ServerAuth>
)

export default Page
