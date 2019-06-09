import React from 'react'
import pick from 'lodash/pick'
import { useAppData } from 'apollo/query'
import { useCreateNode, useUpdateNode, useDeleteNode } from 'apollo/mutation'
import { useManualQuery } from 'apollo/query'
import { useQuery } from 'react-apollo-hooks'

const withBasePage = (params) => WrappedComponent => {
  const {
    node,
    dataFormatter = (e) => e,
    pageName,
    dialogPath,
    listQuery,
    detailsQuery,
    dialogProps = {}
  } = params
  function BasePage(props) {
    const [appData, setAppData] = useAppData()
    const { auth } = appData
    const { data: listData, refetch } = useQuery(listQuery, { variables: { user_id: auth && auth.id } })
    const [, detailsHandler] = useManualQuery(detailsQuery)
    const [createNode] = useCreateNode({ node, callback: refetch })
    const [updateNode] = useUpdateNode({ node, callback: refetch })
    const [deleteNode] = useDeleteNode({ node, callback: refetch })
    return (
      <WrappedComponent
        onDelete={handleDelete}
        onGetList={refetch}
        onNew={handleNew}
        onEdit={handleEdit}
        rows={listData[node] || []}
        {...pick(params, ['pageName', 'node', 'dataPropKey'])}
        {...props}
      />
    )

    function handleNew() {
      setAppData('dialog', {
        path: dialogPath,
        props: {
          ...dialogProps,
          dialogId: dialogPath,
          title: `New ${pageName}`,
          onValid: (data) => {
            createNode({
              variables: { input: dataFormatter(data, 'SAVE_CREATE', { user: auth }) },
            })
          }
        }
      })
    }

    async function handleEdit(row) {
      const response = await detailsHandler.onQuery({ variables: { id: row.id }})
      const [data] = response[node] || []
      if (data) {
        setAppData('dialog', {
          path: dialogPath,
          props: {
            ...dialogProps,
            title: `Edit ${pageName}`,
            initialFields: dataFormatter(data, 'EDIT', props),
            onValid: (updatedData) => {
              updateNode({
                variables: { input: dataFormatter(updatedData, 'SAVE_EDIT', { user: auth }) },
              })
            }
          }
        })
      }
    }

    function handleDelete(data) {
      setAppData('dialog', {
        path: 'Confirm',
        props: {
          title: 'Confirm Delete',
          message: 'Do you want to delete this item?',
          onValid: () => {
            deleteNode({
              variables: { id: data.id }
            })
          }
        }
      })
    }
  }

  BasePage.displayName = `withBasePage(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`

  return BasePage
}

export default withBasePage