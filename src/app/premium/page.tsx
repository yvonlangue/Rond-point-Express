
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const premiumFeatures = [
    'Unlimited event listings',
    'Featured event placement',
    'Detailed event analytics (views, clicks)',
    'Priority support',
    'Integrated ticketing options'
];

export default function PremiumPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-tight">Go Premium</h1>
                <p className="text-xl text-muted-foreground mt-4">
                    Unlock powerful tools to maximize your event's reach and success.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl">Premium Plan</CardTitle>
                        <CardDescription>
                            All the features you need to host successful events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-4xl font-bold">
                            25,000 XAF <span className="text-lg font-normal text-muted-foreground">/ month</span>
                        </p>
                        <ul className="space-y-3">
                            {premiumFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span className="text-base">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full">Upgrade Now</Button>
                    </CardFooter>
                </Card>
                
                <div className="space-y-6 p-4">
                    <h3 className="text-2xl font-bold">Payment Information</h3>
                    <p className="text-muted-foreground">
                        We partner with trusted local payment providers for secure transactions.
                        You can pay using Orange Money or MTN Mobile Money.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Placeholder for Mobile Money logos */}
                        <div className="w-24 h-12 bg-muted rounded-md flex items-center justify-center font-bold">Orange</div>
                        <div className="w-24 h-12 bg-muted rounded-md flex items-center justify-center font-bold">MTN</div>
                    </div>
                     <p className="text-sm text-muted-foreground pt-4">
                        By clicking "Upgrade Now", you agree to our Terms of Service and Privacy Policy.
                        Your subscription will automatically renew each month, and you can cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
