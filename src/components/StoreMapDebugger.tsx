import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { storeService } from '@/services/store'

const StoreMapDebugger: React.FC = () => {
    const { data: mapStores, isLoading: mapLoading } = useQuery(
        'stores-map-debug',
        () => storeService.getStoresForMap(),
        { staleTime: 0 } // Always fetch fresh data
    )

    const { data: allStores, isLoading: allLoading } = useQuery(
        'stores-all-debug',
        () => storeService.getStores(),
        { staleTime: 0 } // Always fetch fresh data
    )

    useEffect(() => {
        console.log('=== Store Debug Info ===')
        console.log('Map stores:', mapStores)
        console.log('All stores:', allStores)

        if (mapStores && mapStores.length > 0) {
            console.log('Sample map store:', mapStores[0])
            console.log('Map store keys:', Object.keys(mapStores[0]))
        }

        if (allStores && allStores.length > 0) {
            console.log('Sample all store:', allStores[0])
            console.log('All store keys:', Object.keys(allStores[0]))
        }
    }, [mapStores, allStores])

    if (mapLoading || allLoading) {
        return <div>Loading debug info...</div>
    }

    return (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 m-4">
            <h3 className="font-bold text-lg mb-4">Store API Debug Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Map Endpoint Results */}
                <div className="bg-white rounded p-3">
                    <h4 className="font-semibold mb-2">Map Endpoint (/api/stores/map)</h4>
                    <p><strong>Count:</strong> {mapStores?.length || 0}</p>
                    {mapStores && mapStores.length > 0 && (
                        <div className="mt-2">
                            <p><strong>Sample Store:</strong></p>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                                {JSON.stringify(mapStores[0], null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {/* All Stores Endpoint Results */}
                <div className="bg-white rounded p-3">
                    <h4 className="font-semibold mb-2">All Stores Endpoint (/api/stores)</h4>
                    <p><strong>Count:</strong> {allStores?.length || 0}</p>
                    {allStores && allStores.length > 0 && (
                        <div className="mt-2">
                            <p><strong>Sample Store:</strong></p>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                                {JSON.stringify(allStores[0], null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <h4 className="font-semibold mb-2">Active Status Analysis</h4>
                <div className="bg-white rounded p-3">
                    {mapStores?.map((store, index) => (
                        <div key={store.id} className="mb-2 text-sm">
                            <strong>{store.name}:</strong>
                            <span className="ml-2">
                                isActive = {JSON.stringify(store.isActive)}
                                (type: {typeof store.isActive})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal ml-4 mt-1">
                    <li>Check the console for detailed logs</li>
                    <li>Look at the "Sample Store" JSON above to see the actual structure</li>
                    <li>Check if `isActive` field exists or if it's named differently</li>
                    <li>Remove this component once debugging is complete</li>
                </ol>
            </div>
        </div>
    )
}

export default StoreMapDebugger