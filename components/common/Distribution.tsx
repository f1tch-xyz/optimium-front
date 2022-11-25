import React from "react";
import PropTypes from "prop-types";
import MultiProgress from 'react-multi-progress';
import Box from "@mui/material/Box";



function Distribution({ heading, items }: any) {

    const total = items.reduce((total: any, { percentage }: any) => total + percentage, 0);

    const colors = ['#000000', '#8d8d8d', '#cccccc'];

    // Sort by percentage
    items = items.sort((a: any, b: any) => b.percentage - a.percentage);

    items = items.map((item: any, index: number) => ({
        ...item,
        value: (item.percentage / total) * 100,
        color: colors[index],
    }));

    return (
        <section>
            <Box pt={2} px={3}>
                <div style={{ fontWeight: '600' }}>
                    {heading}
                </div>
                <MultiProgress
                    className="multiprogress-distribution"
                    border="0px solid #000"
                    elements={items}
                />
            </Box>

            <Box pt={2} px={3}>
                {items.map(({ item, percentage }: any, index: any) => {
                    const color = colors[index % colors.length];
                    return (
                        <Box key={index} p={1}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', lineHeight: '15px' }}>
                                    <div style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: colors[index], marginRight: '5px' }}></div>
                                    <div>
                                        {item}
                                    </div>
                                </div>

                                <div style={{ display: 'flex' }}>
                                    {percentage}%
                                </div>
                            </div>
                        </Box>
                    );
                })}
            </Box>


        </section>
    );
}

export default Distribution;
