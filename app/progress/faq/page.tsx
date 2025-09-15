'use client';

import React from 'react';
import LearnLayout from '@/components/LearnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ProgressFAQPage = () => {
  return (
    <LearnLayout title="Progress Dashboard FAQ">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What does the progress dashboard show?</AccordionTrigger>
              <AccordionContent>
                The progress dashboard shows your progress through the various learning modules. It displays your overall progress, as well as a breakdown of your progress for each module.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How is my progress calculated?</AccordionTrigger>
              <AccordionContent>
                Your progress for each module is calculated based on the number of lessons you have completed and your scores on the practice sessions. To complete a module, you need to complete all lessons and practice sessions with a score of 80% or higher.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What do the different statuses mean?</AccordionTrigger>
              <AccordionContent>
                - **Not Started:** You have not started the module yet.<br />
                - **In Progress:** You have started the module but have not completed it yet.<br />
                - **Completed:** You have successfully completed the module.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I reset my progress?</AccordionTrigger>
              <AccordionContent>
                Yes, you can reset your progress for any module by clicking the "Reset Progress" button on the progress page. Please note that this action cannot be undone.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </LearnLayout>
  );
};

export default ProgressFAQPage;
