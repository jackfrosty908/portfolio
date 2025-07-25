import { MailIcon } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';

const PendingFeature = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MailIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <CardTitle>Thank you for signing up!</CardTitle>
          <CardDescription>
            We've sent a verification link to your email. Please check your
            inbox to complete your registration.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PendingFeature;
