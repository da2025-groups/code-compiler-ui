import { useParams } from 'react-router-dom'
import QuestionForm from '../../features/admin/questions/components/QuestionForm'

function AdminQuestionEditPage() {
  const { id } = useParams()

  return <QuestionForm mode="edit" questionId={id} />
}

export default AdminQuestionEditPage
