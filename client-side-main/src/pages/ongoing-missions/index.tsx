import Container from 'app/shared/components/Container'
import Card from './components/Card'
import Breadcrumb from 'app/shared/components/Breadcrumb'
import { useGetOngoingMissions } from 'app/store/hooks'
import Loading from 'app/shared/components/Loading'
import If from 'app/shared/components/If'
import { PaginatedContent } from 'app/shared/components/paginated'
import { useState } from 'react'

const OngoingMissions = () => {
  const { data, loading } = useGetOngoingMissions()
  const [page, setPage] = useState(1)
  const pageSize = 3

  return (
    <Container>
      <div className="py-20">
        <div className="py-4">
          <Breadcrumb
            path={[
              {
                label: 'Accueil',
                path: '',
              },
              {
                label: 'Mes missions encours',
                path: '/ongoing',
              },
            ]}
          />
        </div>

        <div className="col-span-2 bg-white  rounded-sm pb-10">
          <div className="uppercase bg-primary p-4 lg:px-6 md:px-6 block  text-white font-medium ">
            Mes missions encours
          </div>

          <Container>
            <div className="grid gap-y-4 divide-y">
              <If test={loading}>
                <Loading />
              </If>
              <If test={!loading && data}>
                <PaginatedContent
                  page={page}
                  pageSize={pageSize}
                  data={data}
                  onChange={pageNumber => setPage(pageNumber)}
                  onLoadMore={() => {}}
                  total={data?.length ? data.length : 0}
                  item={({ data }) => {
                    const { _id, reason, typeCar, date, client, rapportId } =
                      data

                    return (
                      <Card
                        key={_id}
                        id={_id}
                        comment={reason + ' - ' + typeCar}
                        date={date}
                        client={client[0]}
                        report={rapportId}
                      />
                    )
                  }}
                ></PaginatedContent>
              </If>
            </div>
          </Container>
        </div>
      </div>
    </Container>
  )
}

export default OngoingMissions
